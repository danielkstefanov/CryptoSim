package com.cryptosim.repository;

import com.cryptosim.model.Order;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.util.List;

@Repository
public class OrderRepository {
    private final JdbcTemplate jdbcTemplate;

    public OrderRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<Order> orderMapper = (rs, rowNum) -> {
        Order order = new Order();
        order.setId(rs.getLong("id"));
        order.setUserId(rs.getLong("user_id"));
        order.setOrderType(rs.getString("order_type"));
        order.setSymbol(rs.getString("symbol"));
        order.setAmount(rs.getBigDecimal("amount"));
        order.setCurrentPrice(rs.getBigDecimal("current_price"));
        order.setCreatedAt(rs.getTimestamp("created_at").toLocalDateTime());
        order.setUpdatedAt(rs.getTimestamp("updated_at").toLocalDateTime());
        return order;
    };

    public Order save(Order order) {
        String sql = """
            INSERT INTO orders (user_id, order_type, symbol, amount, current_price, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            RETURNING id
            """;
        
        Timestamp now = Timestamp.valueOf(java.time.LocalDateTime.now());
        Long id = jdbcTemplate.queryForObject(sql, Long.class,
            order.getUserId(),
            order.getOrderType(),
            order.getSymbol(),
            order.getAmount(),
            order.getCurrentPrice(),
            now,
            now
        );
        
        order.setId(id);
        order.setCreatedAt(now.toLocalDateTime());
        order.setUpdatedAt(now.toLocalDateTime());
        return order;
    }

    public List<Order> findByUserId(Long userId) {
        String sql = "SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC";
        return jdbcTemplate.query(sql, orderMapper, userId);
    }

    public List<Order> findByUserIdAndSymbol(Long userId, String symbol) {
        String sql = "SELECT * FROM orders WHERE user_id = ? AND symbol = ? ORDER BY created_at DESC";
        return jdbcTemplate.query(sql, orderMapper, userId, symbol);
    }

    public int deleteAllByUserId(Long userId) {
        String sql = "DELETE FROM orders WHERE user_id = ?";
        return jdbcTemplate.update(sql, userId);
    }
} 