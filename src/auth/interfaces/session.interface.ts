import { SafeUser } from '@/shared/model/db';

export type SessionUser = SafeUser & { sessionId: string };
