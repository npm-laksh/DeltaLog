package com.laksh.app.deltalog.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String description;
    private Integer durationMins;

    @ManyToOne
    @JoinColumn(name = "attendance_id")
    private Attendance attendance;
}
