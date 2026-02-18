using BellaDesignHub.Application.Models.Requests;
using BellaDesignHub.Domain.Entities;
using BellaDesignHub.Infrastructure.Persistence.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BellaDesignHub.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductionSchedulesController(ApplicationDbContext context) : ControllerBase
{
    private readonly ApplicationDbContext _context = context;

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ProductionSchedule>>> GetSchedules(
        [FromQuery] DateOnly? scheduledDate,
        [FromQuery] DateOnly? startDate,
        [FromQuery] DateOnly? endDate,
        [FromQuery] ProductionStatus? status,
        CancellationToken cancellationToken)
    {
        var query = _context.ProductionSchedules
            .Include(ps => ps.Product)
            .Include(ps => ps.Parts)
            .AsNoTracking()
            .AsQueryable();

        if (scheduledDate.HasValue)
        {
            query = query.Where(ps => ps.ScheduledDate == scheduledDate.Value);
        }

        if (startDate.HasValue)
        {
            query = query.Where(ps => ps.ScheduledDate >= startDate.Value);
        }

        if (endDate.HasValue)
        {
            query = query.Where(ps => ps.ScheduledDate <= endDate.Value);
        }

        if (status.HasValue)
        {
            query = query.Where(ps => ps.Status == status.Value);
        }

        var schedules = await query
            .OrderBy(ps => ps.ScheduledDate)
            .ThenBy(ps => ps.Product!.Name)
            .ToListAsync(cancellationToken);

        return Ok(schedules);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ProductionSchedule>> GetScheduleById(Guid id, CancellationToken cancellationToken)
    {
        var schedule = await _context.ProductionSchedules
            .Include(ps => ps.Product)
            .Include(ps => ps.Parts)
            .AsNoTracking()
            .FirstOrDefaultAsync(ps => ps.Id == id, cancellationToken);

        if (schedule is null)
        {
            return NotFound();
        }

        return Ok(schedule);
    }

    [HttpPost]
    public async Task<ActionResult<ProductionSchedule>> CreateSchedule([FromBody] CreateProductionScheduleRequest request, CancellationToken cancellationToken)
    {
        var product = await _context.Products
            .Include(p => p.Parts)
            .FirstOrDefaultAsync(p => p.Id == request.ProductId, cancellationToken);

        if (product is null)
        {
            return BadRequest("Produto não encontrado.");
        }

        if (!product.Parts.Any())
        {
            return BadRequest("Produto não possui peças cadastradas.");
        }

        var existingSchedule = await _context.ProductionSchedules
            .Include(ps => ps.Parts)
            .FirstOrDefaultAsync(ps => ps.ProductId == product.Id && ps.ScheduledDate == request.ScheduledDate, cancellationToken);

        if (existingSchedule is not null)
        {
            existingSchedule.Quantity += request.Quantity;
            existingSchedule.UpdatedAt = DateTime.UtcNow;

            foreach (var productPart in product.Parts)
            {
                var schedulePart = existingSchedule.Parts.FirstOrDefault(part => part.Name == productPart.Name);

                if (schedulePart is null)
                {
                    existingSchedule.Parts.Add(new ProductionSchedulePart
                    {
                        ProductionScheduleId = existingSchedule.Id,
                        Name = productPart.Name,
                        Measurements = productPart.Measurements,
                        Quantity = productPart.Quantity * existingSchedule.Quantity
                    });
                }
                else
                {
                    schedulePart.Measurements = productPart.Measurements;
                    schedulePart.Quantity = productPart.Quantity * existingSchedule.Quantity;
                }
            }

            var productPartNames = product.Parts.Select(part => part.Name).ToHashSet(StringComparer.OrdinalIgnoreCase);
            existingSchedule.Parts = existingSchedule.Parts
                .Where(part => productPartNames.Contains(part.Name))
                .ToList();

            await _context.SaveChangesAsync(cancellationToken);
            existingSchedule.Product = product;
            return Ok(existingSchedule);
        }

        var schedule = new ProductionSchedule
        {
            ProductId = product.Id,
            ScheduledDate = request.ScheduledDate,
            Quantity = request.Quantity,
            Status = ProductionStatus.Planned,
            Parts = product.Parts
                .Select(part => new ProductionSchedulePart
                {
                    Name = part.Name,
                    Measurements = part.Measurements,
                    Quantity = part.Quantity * request.Quantity
                })
                .ToList()
        };

        await _context.ProductionSchedules.AddAsync(schedule, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);

        schedule.Product = product;

        return CreatedAtAction(nameof(GetScheduleById), new { id = schedule.Id }, schedule);
    }

    [HttpPatch("{id:guid}/status")]
    public async Task<ActionResult<ProductionSchedule>> UpdateStatus(Guid id, [FromBody] UpdateProductionStatusRequest request, CancellationToken cancellationToken)
    {
        var schedule = await _context.ProductionSchedules
            .Include(ps => ps.Product)
            .Include(ps => ps.Parts)
            .FirstOrDefaultAsync(ps => ps.Id == id, cancellationToken);

        if (schedule is null)
        {
            return NotFound();
        }

        schedule.Status = request.Status;
        schedule.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync(cancellationToken);

        return Ok(schedule);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteSchedule(Guid id, CancellationToken cancellationToken)
    {
        var schedule = await _context.ProductionSchedules.FirstOrDefaultAsync(ps => ps.Id == id, cancellationToken);

        if (schedule is null)
        {
            return NotFound();
        }

        _context.ProductionSchedules.Remove(schedule);
        await _context.SaveChangesAsync(cancellationToken);

        return NoContent();
    }
}
