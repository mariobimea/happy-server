import { Socket } from "socket.io";
import { buildSessionLifecycleEphemeral, eventRouter } from "@/app/events/eventRouter";
import { log } from "@/utils/log";

export function sessionLifecycleHandler(userId: string, socket: Socket) {
    socket.on('session-lifecycle', (data: {
        machineId: string;
        tempId: string;
        stage: 'spawning' | 'initializing' | 'ready' | 'error';
        sessionId?: string;
        error?: string;
        directory?: string;
        timestamp: number;
    }) => {
        log({ module: 'session-lifecycle' }, `Received lifecycle event: stage=${data.stage}, tempId=${data.tempId}`);

        const payload = buildSessionLifecycleEphemeral(
            data.machineId,
            data.tempId,
            data.stage,
            {
                sessionId: data.sessionId,
                error: data.error,
                directory: data.directory
            }
        );

        eventRouter.emitEphemeral({
            userId,
            payload,
            recipientFilter: { type: 'user-scoped-only' }
        });
    });
}
