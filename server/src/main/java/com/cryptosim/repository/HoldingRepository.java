package com.cryptosim.repository;

import com.cryptosim.model.Holding;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;
import java.math.BigDecimal;

@Repository
public class HoldingRepository {
    private final JdbcTemplate jdbcTemplate;

    public HoldingRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<Holding> holdingMapper = (rs, rowNum) -> {
        Holding holding = new Holding();
        holding.setId(rs.getLong("id"));
        holding.setUserId(rs.getLong("user_id"));
        holding.setSymbol(rs.getString("symbol"));
        holding.setAmount(rs.getBigDecimal("amount"));
        holding.setCreatedAt(rs.getTimestamp("created_at").toLocalDateTime());
        holding.setUpdatedAt(rs.getTimestamp("updated_at").toLocalDateTime());
        return holding;
    };

    public List<Holding> findByUserId(Long userId) {
        String sql = "SELECT * FROM holdings WHERE user_id = ?";
        return jdbcTemplate.query(sql, holdingMapper, userId);
    }

    public Optional<Holding> findByUserIdAndSymbol(Long userId, String symbol) {
        String sql = "SELECT * FROM holdings WHERE user_id = ? AND symbol = ?";
        List<Holding> holdings = jdbcTemplate.query(sql, holdingMapper, userId, symbol);
        return holdings.stream().findFirst();
    }

    public void updateAmount(Long userId, String symbol, BigDecimal newAmount) {
        Timestamp now = Timestamp.valueOf(java.time.LocalDateTime.now());
        String sql = """
            INSERT INTO holdings (user_id, symbol, amount, updated_at) 
            VALUES (?, ?, ?, ?)
            ON CONFLICT (user_id, symbol) 
            DO UPDATE SET amount = ?, updated_at = ?
            """;
        jdbcTemplate.update(sql, userId, symbol, newAmount, now, newAmount, now);
    }

    public void deleteByUserIdAndSymbol(Long userId, String symbol) {
        String sql = "DELETE FROM holdings WHERE user_id = ? AND symbol = ?";
        jdbcTemplate.update(sql, userId, symbol);
    }

    public int deleteAllByUserId(Long userId) {
        String sql = "DELETE FROM holdings WHERE user_id = ?";
        return jdbcTemplate.update(sql, userId);
    }
} 