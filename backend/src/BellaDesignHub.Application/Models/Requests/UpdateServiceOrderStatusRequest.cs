using System.ComponentModel.DataAnnotations;
using BellaDesignHub.Domain.Entities;

namespace BellaDesignHub.Application.Models.Requests;

public record UpdateServiceOrderStatusRequest(
    [Required] ServiceOrderStatus Status
);
