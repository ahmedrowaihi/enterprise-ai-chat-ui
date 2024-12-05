type Resolution = "low" | "high";
export type Features = {
  moreLikeThis: {
    enabled: boolean;
  };
  opening: {
    enabled: boolean;
  };
  suggested: {
    enabled: boolean;
  };
  text2speech: {
    enabled: boolean;
  };
  speech2text: {
    enabled: boolean;
  };
  citation: {
    enabled: boolean;
  };
  moderation: {
    enabled: boolean;
  };
  file: {
    image: {
      enabled: boolean;
      detail: Resolution;
      number_limits: number;
      transfer_methods: [];
    };
  };
  annotationReply: {
    enabled: boolean;
  };
};
