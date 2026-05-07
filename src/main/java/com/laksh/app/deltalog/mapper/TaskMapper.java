package com.laksh.app.deltalog.mapper;

import com.laksh.app.deltalog.dto.response.TaskResponseDTO;
import com.laksh.app.deltalog.entity.Task;
import org.springframework.stereotype.Component;

@Component
public class TaskMapper {

    public TaskResponseDTO toTaskResponseDTO(Task task){
        return new TaskResponseDTO(
                task.getId(),
                task.getTitle(),
                task.getDescription(),
                task.getDurationMins(),
                task.getCreatedAt(),

                // fetch attendance id from attendance entity
                task.getAttendance() != null ? task.getAttendance().getId() : null
        );
    }
}
