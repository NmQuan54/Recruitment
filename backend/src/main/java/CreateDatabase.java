import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.Statement;

public class CreateDatabase {
    public static void main(String[] args) {
        String jdbcUrl = "jdbc:postgresql://localhost:5432/";
        String username = "postgres";
        String password = "123456789";

        try {
            System.out.println("Loading driver...");
            Class.forName("org.postgresql.Driver");

            System.out.println("Connecting to PostgreSQL...");
            Connection conn = DriverManager.getConnection(jdbcUrl, username, password);
            Statement stmt = conn.createStatement();

            String createDbSql = "CREATE DATABASE recruitment_db";
            System.out.println("Executing: " + createDbSql);

            try {
                stmt.executeUpdate(createDbSql);
                System.out.println("SUCCESS: Database recruitment_db created!");
            } catch (Exception e) {
                System.out.println("Message: " + e.getMessage());
            }

            stmt.close();
            conn.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
