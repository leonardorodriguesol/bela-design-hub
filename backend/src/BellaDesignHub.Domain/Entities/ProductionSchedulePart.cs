namespace BellaDesignHub.Domain.Entities;

public class ProductionSchedulePart
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid ProductionScheduleId { get; set; }
    public ProductionSchedule? ProductionSchedule { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Measurements { get; set; }
    public int Quantity { get; set; }
}
