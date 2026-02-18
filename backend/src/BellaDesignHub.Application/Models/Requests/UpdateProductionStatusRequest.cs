using System.ComponentModel.DataAnnotations;
using BellaDesignHub.Domain.Entities;

namespace BellaDesignHub.Application.Models.Requests;

public record class UpdateProductionStatusRequest
{
    [Required]
    public ProductionStatus Status { get; init; }
}
