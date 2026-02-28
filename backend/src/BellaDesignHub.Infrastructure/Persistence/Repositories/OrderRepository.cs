using BellaDesignHub.Application.Orders;
using BellaDesignHub.Domain.Entities;
using BellaDesignHub.Infrastructure.Persistence.Data;
using Microsoft.EntityFrameworkCore;

namespace BellaDesignHub.Infrastructure.Persistence.Repositories;

public class OrderRepository(ApplicationDbContext context) : IOrderRepository
{
    private readonly ApplicationDbContext _context = context;

    public async Task<List<Order>> ListAsync(OrderQueryFilter filter, CancellationToken cancellationToken)
    {
        var query = _context.Orders
            .AsNoTracking()
            .Include(order => order.Items)
            .AsQueryable();

        if (filter.CustomerId.HasValue)
        {
            query = query.Where(order => order.CustomerId == filter.CustomerId.Value);
        }

        if (filter.Status.HasValue)
        {
            query = query.Where(order => order.Status == filter.Status.Value);
        }

        if (filter.CreatedFrom.HasValue)
        {
            query = query.Where(order => order.CreatedAt >= filter.CreatedFrom.Value);
        }

        if (filter.CreatedTo.HasValue)
        {
            query = query.Where(order => order.CreatedAt <= filter.CreatedTo.Value);
        }

        return await query
            .OrderByDescending(order => order.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task<Order?> GetByIdAsync(Guid id, bool asNoTracking, CancellationToken cancellationToken)
    {
        var query = _context.Orders
            .Include(order => order.Items)
            .AsQueryable();

        if (asNoTracking)
        {
            query = query.AsNoTracking();
        }

        return await query.FirstOrDefaultAsync(order => order.Id == id, cancellationToken);
    }

    public async Task<bool> CustomerExistsAsync(Guid customerId, CancellationToken cancellationToken)
    {
        return await _context.Customers.AnyAsync(customer => customer.Id == customerId, cancellationToken);
    }

    public async Task<IReadOnlyCollection<Guid>> GetExistingProductIdsAsync(
        IReadOnlyCollection<Guid> productIds,
        CancellationToken cancellationToken)
    {
        if (productIds.Count == 0)
        {
            return Array.Empty<Guid>();
        }

        var existingIds = await _context.Products
            .AsNoTracking()
            .Where(product => productIds.Contains(product.Id))
            .Select(product => product.Id)
            .ToListAsync(cancellationToken);

        return existingIds;
    }

    public async Task AddAsync(Order order, CancellationToken cancellationToken)
    {
        await _context.Orders.AddAsync(order, cancellationToken);
    }

    public void ReplaceItems(Order order, IReadOnlyCollection<OrderItem> newItems)
    {
        _context.OrderItems.RemoveRange(order.Items);

        var replacementItems = newItems.ToList();
        order.Items = replacementItems;
        _context.OrderItems.AddRange(replacementItems);
    }

    public void Remove(Order order)
    {
        _context.Orders.Remove(order);
    }

    public async Task SaveChangesAsync(CancellationToken cancellationToken)
    {
        await _context.SaveChangesAsync(cancellationToken);
    }
}
