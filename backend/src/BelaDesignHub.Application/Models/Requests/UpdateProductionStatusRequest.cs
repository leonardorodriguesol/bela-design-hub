using System.ComponentModel.DataAnnotations;
using BelaDesignHub.Domain.Entities;

namespace BelaDesignHub.Application.Models.Requests;

public record class UpdateProductionStatusRequest
{
    [Required]
    public ProductionStatus Status { get; init; }
}
