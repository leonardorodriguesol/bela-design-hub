using System.ComponentModel.DataAnnotations;

namespace BelaDesignHub.Application.Models.Requests;

public record ProductPartRequest(
    [Required(AllowEmptyStrings = false)][MaxLength(200)] string Name,
    [MaxLength(200)] string? Measurements,
    [Range(1, int.MaxValue)] int Quantity
);
