import { memo } from 'react';
import type { FC } from 'react';

import resets from '../_resets.module.css';
import classes from './Desktop1.module.css';
import { Rectangle2Icon } from './Rectangle2Icon';

interface Props {
  className?: string;
}
/* @figmaId 2:3 */
export const Desktop1: FC<Props> = memo(function Desktop1(props = {}) {
  return (
    <div className={`${resets.storybrainResets} ${classes.root}`}>
      <div className={classes.rectangle2}>
        <Rectangle2Icon className={classes.icon} />
      </div>
      <div className={classes.rectangle3}></div>
      <div className={classes.rectangle4}></div>
      <div className={classes.yOURCHOICE}>YOUR CHOICE</div>
    </div>
  );
});
