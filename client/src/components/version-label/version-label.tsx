import {CONFIG} from "common/config";
import css from './version-label.module.scss'

export function VersionLabel() {
    return <p className={css.version}>V{CONFIG.version}</p>
}