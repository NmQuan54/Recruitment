$server = "localhost"
$port = 5432
$user = "postgres"
$password = "123456789"
$databaseToCreate = "recruitment_db"

Write-Host "Connecting to PostgreSQL..."
$connectionString = "Host=$server;Port=$port;Username=$user;Password=$password;Database=postgres"

try {
    # We use Odbc since it's generally available in Windows for Postgres, but 
    # since we don't know if the ODBC driver is installed, let's just use the simplest approach
    # We will download the Npgsql dll if needed, or use a basic ADO.NET approach if we can.
    
    # Actually, the easiest way on Windows without knowing what drivers are installed
    # is to just find the psql executable. It's usually in one of these paths:
    $psqlPaths = @(
        "C:\Program Files\PostgreSQL\17\bin\psql.exe",
        "C:\Program Files\PostgreSQL\16\bin\psql.exe",
        "C:\Program Files\PostgreSQL\15\bin\psql.exe",
        "C:\Program Files\PostgreSQL\14\bin\psql.exe",
        "C:\Program Files\PostgreSQL\13\bin\psql.exe",
        "C:\Program Files\PostgreSQL\12\bin\psql.exe"
    )

    $foundPsql = $false
    foreach ($path in $psqlPaths) {
        if (Test-Path $path) {
            Write-Host "Found psql at: $path"
            $foundPsql = $true
            $env:PGPASSWORD = $password
            & $path -U $user -c "CREATE DATABASE $databaseToCreate;"
            Write-Host "Database created successfully using psql!"
            break
        }
    }

    if (-not $foundPsql) {
        Write-Host "Could not find psql.exe in standard Postgres installation paths."
        Write-Host "Please ensure PostgreSQL is installed on this machine."
    }
}
catch {
    Write-Host "Error occurred: $_"
}
