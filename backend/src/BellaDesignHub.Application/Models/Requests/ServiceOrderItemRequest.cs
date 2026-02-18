using System.ComponentModel.DataAnnotations;

namespace BellaDesignHub.Application.Models.Requests;

public record ServiceOrderItemRequest(
    Guid? OrderItemId,
    [Required(AllowEmptyStrings = false)][MaxLength(250)] string Description,
    [Range(1, int.MaxValue)] int Quantity,
    [Range(typeof(decimal), "0", "9999999999")] decimal UnitPrice
);
