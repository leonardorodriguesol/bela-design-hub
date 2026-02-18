using System.ComponentModel.DataAnnotations;
using BelaDesignHub.Domain.Entities;

namespace BelaDesignHub.Application.Models.Requests;

public record class CreateServiceOrderRequest
{
    [Required]
    public Guid OrderId { get; init; }

    [Required]
    public Guid CustomerId { get; init; }

    [Required]
    public DateOnly ScheduledDate { get; init; } = DateOnly.FromDateTime(DateTime.UtcNow.Date);

    [MaxLength(150)]
    public string? Responsible { get; init; }

    [MaxLength(1000)]
    public string? Notes { get; init; }

    public List<ServiceOrderItemRequest>? Items { get; init; }
}
