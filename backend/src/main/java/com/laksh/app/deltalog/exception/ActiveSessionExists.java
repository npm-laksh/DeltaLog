package com.laksh.app.deltalog.exception;

public class ActiveSessionExists extends RuntimeException {
    public ActiveSessionExists(String message) {
        super(message);
    }
}
