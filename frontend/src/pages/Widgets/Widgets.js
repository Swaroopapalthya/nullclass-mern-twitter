import React from "react";
import './Widgets.css'
import { useTranslation } from 'react-i18next';
const Widgets = () => {
    const { t } = useTranslation();
    return (
        <div>
            <h1>{t('Widgets')}</h1>
            {/* <p>{t('explore')}</p> */}
        </div>
    );
}
export default Widgets;