import { prisma } from '../database/client';

export class MapService {
  async saveNote(serverId: string, x: number, y: number, label: string, color: string) {
    return await prisma.mapNote.create({
      data: { serverId, x, y, label, color }
    });
  }

  async getNotes(serverId: string) {
    return await prisma.mapNote.findMany({ where: { serverId } });
  }

  async deleteNote(noteId: string) {
    return await prisma.mapNote.delete({ where: { id: noteId } });
  }
}

export const mapService = new MapService();
