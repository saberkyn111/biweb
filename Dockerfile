# =======================================================
# Multi-Stage Build Dockerfile for BIWEB Platform
# Base: .NET Core 3.1 SDK & ASP.NET Runtime
# =======================================================

# Stage 1: Build & Publish
FROM mcr.microsoft.com/dotnet/core/sdk:3.1 AS build
WORKDIR /src

# Copy Solution and Project files for caching restore layer
COPY ["Biweb.sln", "./"]
COPY ["DoAn-FW/DoAn-FW.csproj", "DoAn-FW/"]
RUN dotnet restore "DoAn-FW/DoAn-FW.csproj"

# Copy entire repository source code
COPY . .
WORKDIR "/src/DoAn-FW"

# Build and Publish Release package
RUN dotnet publish "DoAn-FW.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Stage 2: Runtime Image
FROM mcr.microsoft.com/dotnet/core/aspnet:3.1 AS final
WORKDIR /app
COPY --from=build /app/publish .

# Expose standard HTTP/HTTPS ports
ENV ASPNETCORE_URLS=http://+:8080
ENV ASPNETCORE_ENVIRONMENT=Production
EXPOSE 8080

ENTRYPOINT ["dotnet", "Biweb.dll"]
