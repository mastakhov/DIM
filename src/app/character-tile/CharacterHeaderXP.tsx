import React from 'react';
import clsx from 'clsx';
import { t } from 'app/i18next-t';

import { D1Store } from '../inventory/store-types';
import PressTip from '../dim-ui/PressTip';
import { percent } from '../shell/filters';
import { D1ProgressionHashes } from 'app/search/d1-known-values';

function getLevelBar(store: D1Store) {
  const prestige = store.progression?.progressions.find(
    (p) => p.progressionHash === D1ProgressionHashes.Prestige
  );
  let levelBar = store?.percentToNextLevel ?? 0;
  let xpTillMote: string | undefined = undefined;
  if (prestige) {
    levelBar = prestige.progressToNextLevel / prestige.nextLevelAt;
    xpTillMote = t('Stats.Prestige', {
      level: prestige.level,
      exp: prestige.nextLevelAt - prestige.progressToNextLevel,
    });
  }
  return {
    levelBar,
    xpTillMote,
  };
}

// This is just a D1 feature, so it only accepts a D1 store.
export default function CharacterHeaderXPBar({ store }: { store: D1Store }) {
  const { levelBar, xpTillMote } = getLevelBar(store);
  return (
    <PressTip tooltip={xpTillMote}>
      <div className="level-bar">
        <div
          className={clsx('level-bar-progress', {
            'mote-progress': !store.percentToNextLevel,
          })}
          style={{ width: percent(levelBar) }}
        />
      </div>
    </PressTip>
  );
}
