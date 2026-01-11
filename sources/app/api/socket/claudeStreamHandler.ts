import { Socket } from "socket.io";
import { buildClaudeStreamEphemeral, eventRouter } from "@/app/events/eventRouter";
import { log } from "@/utils/log";

export function claudeStreamHandler(userId: string, socket: Socket) {
    socket.on('claude-stream', (data: {
        machineId: string;
        sessionId: string;
        event: unknown;
        timestamp: number;
    }) => {
        log({ module: 'claude-stream' }, `Received stream event for session ${data.sessionId}`);

        const payload = buildClaudeStreamEphemeral(data.machineId, data.sessionId, data.event);

        eventRouter.emitEphemeral({
            userId,
            payload,
            recipientFilter: { type: 'user-scoped-only' }
        });
    });
}
