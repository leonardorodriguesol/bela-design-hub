using System.ComponentModel.DataAnnotations;
using BelaDesignHub.Domain.Entities;

namespace BelaDesignHub.Application.Models.Requests;

public record UpdateServiceOrderStatusRequest(
    [Required] ServiceOrderStatus Status
);
