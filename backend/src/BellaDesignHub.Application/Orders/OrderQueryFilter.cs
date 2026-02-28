using BellaDesignHub.Domain.Entities;

namespace BellaDesignHub.Application.Orders;

public sealed record OrderQueryFilter(
    Guid? CustomerId,
    OrderStatus? Status,
    DateTime? CreatedFrom,
    DateTime? CreatedTo
);
