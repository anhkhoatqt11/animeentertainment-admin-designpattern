import { NewestChapterList } from "../(components)/NewestChapterList";
import { NewestEpisodeList } from "../(components)/NewestEpisodeList";

export interface NotificationData {
    sourceId: string;
    type: string;
    content: string;
  }
    
  export interface NotificationStrategy {
    type: string;
    ListComponent: React.FC<{
      setImageChoice: (image: string) => void;
      itemChoice: string[];
      setItemChoice: (items: string[]) => void;
    }>;
    prepareNotificationData(sourceId: string, content: string): NotificationData;
  }
  
  export class ComicNotificationStrategy implements NotificationStrategy {
    type = "comic";
    ListComponent = NewestChapterList;
  
    prepareNotificationData(sourceId: string, content: string): NotificationData {
      return {
        sourceId,
        type: "chapter",
        content,
      };
    }
  }
  
  export class AnimeNotificationStrategy implements NotificationStrategy {
    type = "anime";
    ListComponent = NewestEpisodeList;
  
    prepareNotificationData(sourceId: string, content: string): NotificationData {
      return {
        sourceId,
        type: "episode",
        content,
      };
    }
  }
  
  export const notificationStrategies = {
    comic: new ComicNotificationStrategy(),
    anime: new AnimeNotificationStrategy(),
  };