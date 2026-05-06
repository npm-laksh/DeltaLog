package com.laksh.app.deltalog.controller;

import com.laksh.app.deltalog.dto.request.TaskRequestDTO;
import com.laksh.app.deltalog.dto.response.TaskResponseDTO;
import com.laksh.app.deltalog.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {
    private final TaskService taskService;

    // create new task
    @PostMapping("/create-task")
    public ResponseEntity<TaskResponseDTO> createTask(@RequestBody TaskRequestDTO request) {
        TaskResponseDTO response = taskService.createTask(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    // get all tasks for specific attendance session
    @GetMapping("/attendance/{attendanceId}")
    public ResponseEntity<List<TaskResponseDTO>> getTaskByAttendance(@PathVariable Integer attendanceId) {
        List<TaskResponseDTO> tasks = taskService.getTaskByAttendance(attendanceId);
        return ResponseEntity.ok(tasks);
    }

    // update task


    // delete task
}
