namespace BelaDesignHub.Domain.Entities;

public class ProductPart
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid ProductId { get; set; }
    public Product? Product { get; set; }
    public string Name { get; set; } = string.Empty;
    public int Quantity { get; set; }
}
