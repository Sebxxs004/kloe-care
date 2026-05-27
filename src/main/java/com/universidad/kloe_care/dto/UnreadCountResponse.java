package com.universidad.kloe_care.dto;

/**
 * DTO para la respuesta del contador de mensajes no leídos.
 */
public class UnreadCountResponse {

    private long count;

    public UnreadCountResponse() {
    }

    public UnreadCountResponse(long count) {
        this.count = count;
    }

    public long getCount() {
        return count;
    }

    public void setCount(long count) {
        this.count = count;
    }
}
