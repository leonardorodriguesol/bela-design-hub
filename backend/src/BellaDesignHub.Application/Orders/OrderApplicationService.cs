using BellaDesignHub.Application.Models.Requests;
using BellaDesignHub.Domain.Entities;

namespace BellaDesignHub.Application.Orders;

public class OrderApplicationService(IOrderRepository repository) : IOrderApplicationService
{
    private readonly IOrderRepository _repository = repository;

    public async Task<IReadOnlyList<Order>> GetOrdersAsync(OrderQueryFilter filter, CancellationToken cancellationToken)
    {
        return await _repository.ListAsync(filter, cancellationToken);
    }

    public async Task<Order?> GetOrderByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        return await _repository.GetByIdAsync(id, asNoTracking: true, cancellationToken);
    }

    public async Task<OrderOperationResult<Order>> CreateOrderAsync(CreateOrderRequest request, CancellationToken cancellationToken)
    {
        var customerExists = await _repository.CustomerExistsAsync(request.CustomerId, cancellationToken);
        if (!customerExists)
        {
            return OrderOperationResult<Order>.Failure(OrderOperationError.CustomerNotFound);
        }

        if (!await ProductsAreValidAsync(request.Items, cancellationToken))
        {
            return OrderOperationResult<Order>.Failure(OrderOperationError.InvalidProducts);
        }

        var items = request.Items.Select(MapToOrderItem).ToList();
        var order = new Order
        {
            CustomerId = request.CustomerId,
            Code = string.IsNullOrWhiteSpace(request.Code) ? GenerateOrderCode() : request.Code!,
            DeliveryDate = request.DeliveryDate,
            Items = items,
            TotalAmount = items.Sum(item => item.Total)
        };

        await _repository.AddAsync(order, cancellationToken);
        await _repository.SaveChangesAsync(cancellationToken);

        return OrderOperationResult<Order>.Success(order);
    }

    public async Task<OrderOperationResult<Order>> UpdateOrderAsync(
        Guid id,
        UpdateOrderRequest request,
        CancellationToken cancellationToken)
    {
        var order = await _repository.GetByIdAsync(id, asNoTracking: false, cancellationToken);
        if (order is null)
        {
            return OrderOperationResult<Order>.Failure(OrderOperationError.NotFound);
        }

        if (!await ProductsAreValidAsync(request.Items, cancellationToken))
        {
            return OrderOperationResult<Order>.Failure(OrderOperationError.InvalidProducts);
        }

        order.Code = string.IsNullOrWhiteSpace(request.Code) ? order.Code : request.Code!;
        order.Status = request.Status;
        order.DeliveryDate = request.DeliveryDate;
        order.UpdatedAt = DateTime.UtcNow;

        var updatedItems = request.Items.Select(item => new OrderItem
        {
            OrderId = order.Id,
            ProductId = item.ProductId,
            Description = item.Description,
            Quantity = item.Quantity,
            UnitPrice = item.UnitPrice
        }).ToList();

        _repository.ReplaceItems(order, updatedItems);
        order.TotalAmount = updatedItems.Sum(item => item.Total);

        await _repository.SaveChangesAsync(cancellationToken);

        return OrderOperationResult<Order>.Success(order);
    }

    public async Task<bool> DeleteOrderAsync(Guid id, CancellationToken cancellationToken)
    {
        var order = await _repository.GetByIdAsync(id, asNoTracking: false, cancellationToken);
        if (order is null)
        {
            return false;
        }

        _repository.Remove(order);
        await _repository.SaveChangesAsync(cancellationToken);

        return true;
    }

    private async Task<bool> ProductsAreValidAsync(IEnumerable<OrderItemRequest> items, CancellationToken cancellationToken)
    {
        var productIds = items
            .Where(item => item.ProductId.HasValue)
            .Select(item => item.ProductId!.Value)
            .Distinct()
            .ToList();

        if (productIds.Count == 0)
        {
            return true;
        }

        var existingIds = await _repository.GetExistingProductIdsAsync(productIds, cancellationToken);
        return existingIds.Count == productIds.Count;
    }

    private static OrderItem MapToOrderItem(OrderItemRequest item) => new()
    {
        ProductId = item.ProductId,
        Description = item.Description,
        Quantity = item.Quantity,
        UnitPrice = item.UnitPrice
    };

    private static string GenerateOrderCode() => $"PED-{DateTime.UtcNow:yyyyMMddHHmmss}";
}
