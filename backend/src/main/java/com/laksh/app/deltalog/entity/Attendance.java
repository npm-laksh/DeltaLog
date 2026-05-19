package com.laksh.app.deltalog.entity;

import com.laksh.app.deltalog.enums.AttendanceStatus;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

// to uncomment later
//@Entity
//@Table(
//        name = "attendance",
//        uniqueConstraints = {
//                @UniqueConstraint(
//                        name = "unique_user_daily_attendance",
//                        columnNames = {"user_id", "attendance_date"} // If you add a dedicated date column
//                )
//        }
//)

@Entity
@Table(name = "attendance")
@Data
@NoArgsConstructor
public class Attendance {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private LocalDateTime checkInTime;
    private LocalDateTime checkOutTime;
    private int totalWorkMin;

    @Column(name = "attendance_status")
    @Enumerated(EnumType.STRING)
    private AttendanceStatus status;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private int overtime;
    private int undertime;
}
