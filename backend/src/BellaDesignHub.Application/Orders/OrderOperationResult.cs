namespace BellaDesignHub.Application.Orders;

public sealed class OrderOperationResult<T>
{
    private OrderOperationResult(bool isSuccess, T? value, OrderOperationError error)
    {
        IsSuccess = isSuccess;
        Value = value;
        Error = error;
    }

    public bool IsSuccess { get; }
    public T? Value { get; }
    public OrderOperationError Error { get; }

    public static OrderOperationResult<T> Success(T value) => new(true, value, OrderOperationError.None);

    public static OrderOperationResult<T> Failure(OrderOperationError error) => new(false, default, error);
}
