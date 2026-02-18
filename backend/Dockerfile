# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY BellaDesignHub.sln ./
COPY src/ ./src/
RUN dotnet restore src/BellaDesignHub.Api/BellaDesignHub.Api.csproj

RUN dotnet publish src/BellaDesignHub.Api/BellaDesignHub.Api.csproj -c Release -o /app/publish /p:UseAppHost=false

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "BellaDesignHub.Api.dll"]
