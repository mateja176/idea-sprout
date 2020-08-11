import React from 'react';
import { renderButtons, RenderButtonsParams } from 'services/upgrade';

export const useRenderButtons = (params: RenderButtonsParams) => {
  return React.useCallback(() => renderButtons(params), [params]);
};
