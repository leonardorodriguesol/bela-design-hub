using System;
using System.Collections.Generic;

namespace BellaDesignHub.Domain.Entities;

public enum ServiceOrderStatus
{
    Scheduled = 0,
    InRoute = 1,
    Delivered = 2,
    Cancelled = 3
}

public class ServiceOrder
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid OrderId { get; set; }
    public Order? Order { get; set; }
    public Guid CustomerId { get; set; }
    public Customer? Customer { get; set; }
    public DateOnly ScheduledDate { get; set; }
    public ServiceOrderStatus Status { get; set; } = ServiceOrderStatus.Scheduled;
    public string? Responsible { get; set; }
    public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    public ICollection<ServiceOrderItem> Items { get; set; } = new List<ServiceOrderItem>();
}

public class ServiceOrderItem
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid ServiceOrderId { get; set; }
    public ServiceOrder? ServiceOrder { get; set; }
    public Guid? OrderItemId { get; set; }
    public OrderItem? OrderItem { get; set; }
    public string Description { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
}
