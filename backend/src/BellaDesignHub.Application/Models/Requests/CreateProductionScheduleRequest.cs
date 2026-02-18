using System.ComponentModel.DataAnnotations;
using BellaDesignHub.Domain.Entities;

namespace BellaDesignHub.Application.Models.Requests;

public record class CreateProductionScheduleRequest
{
    [Required]
    public Guid ProductId { get; init; }

    [Required]
    public DateOnly ScheduledDate { get; init; } = DateOnly.FromDateTime(DateTime.UtcNow.Date);

    [Range(1, int.MaxValue)]
    public int Quantity { get; init; }
}
