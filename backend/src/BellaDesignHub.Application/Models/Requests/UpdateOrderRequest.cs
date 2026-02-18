using System.ComponentModel.DataAnnotations;
using BellaDesignHub.Domain.Entities;

namespace BellaDesignHub.Application.Models.Requests;

public record UpdateOrderRequest(
    [MaxLength(30)] string? Code,
    OrderStatus Status,
    DateTime? DeliveryDate,
    [MinLength(1, ErrorMessage = "An order must contain at least one item.")] List<OrderItemRequest> Items
);
