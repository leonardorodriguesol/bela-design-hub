using System.ComponentModel.DataAnnotations;

namespace BelaDesignHub.Application.Models.Requests;

public record class CreateProductRequest
{
    [Required(AllowEmptyStrings = false)][MaxLength(200)]
    public string Name { get; init; } = string.Empty;

    [MaxLength(500)]
    public string? Description { get; init; }

    [MinLength(1, ErrorMessage = "Produto deve ter ao menos uma peça")]
    public List<ProductPartRequest> Parts { get; init; } = new();
}
