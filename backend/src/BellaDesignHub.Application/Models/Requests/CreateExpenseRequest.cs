using System.ComponentModel.DataAnnotations;
using BellaDesignHub.Domain.Entities;

namespace BellaDesignHub.Application.Models.Requests;

public record CreateExpenseRequest(
    [Required][MaxLength(200)] string Description,
    decimal Amount,
    ExpenseCategory Category,
    [Required] DateTime ExpenseDate,
    [MaxLength(500)] string? Notes
);
