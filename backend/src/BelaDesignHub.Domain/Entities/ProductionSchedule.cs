namespace BelaDesignHub.Domain.Entities;

public enum ProductionStatus
{
    Planned = 0,
    InProgress = 1,
    Completed = 2,
    Cancelled = 3
}

public class ProductionSchedule
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid ProductId { get; set; }
    public Product? Product { get; set; }
    public DateOnly ScheduledDate { get; set; } = DateOnly.FromDateTime(DateTime.UtcNow.Date);
    public int Quantity { get; set; }
    public ProductionStatus Status { get; set; } = ProductionStatus.Planned;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    public ICollection<ProductionSchedulePart> Parts { get; set; } = new List<ProductionSchedulePart>();
}
