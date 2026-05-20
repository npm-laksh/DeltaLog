package com.laksh.app.deltalog.exception;

public class AlreadyCheckedOut extends RuntimeException {
    public AlreadyCheckedOut(String message) {
        super(message);
    }
}
