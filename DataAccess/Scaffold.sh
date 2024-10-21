dotnet ef dbcontext scaffold \
 "Server=localhost;Database=mydatabase;User Id=myuser;Password=mypass;" \
 Npgsql.EntityFrameworkCore.PostgreSQL \
 --output-dir Models \
 --context-dir . \
 --context MyDbContext  \
 --no-onconfiguring \
 --data-annotations \
 --force
