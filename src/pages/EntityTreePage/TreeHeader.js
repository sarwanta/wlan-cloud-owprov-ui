import React from 'react';
import PropTypes from 'prop-types';
import { CButton, CPopover, CLabel, CCardHeader, CButtonToolbar } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import {
  cilAlignCenter,
  cilPencil,
  cilPlus,
  cilSave,
  cilSync,
  cilTrash,
  cilX,
} from '@coreui/icons';
import { useTranslation } from 'react-i18next';
import Select from 'react-select';

const groupStyles = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
};
const groupBadgeStyles = {
  backgroundColor: '#EBECF0',
  borderRadius: '2em',
  color: '#172B4D',
  display: 'inline-block',
  fontSize: 12,
  fontWeight: 'normal',
  lineHeight: '1',
  minWidth: 1,
  padding: '0.16666666666667em 0.5em',
  textAlign: 'center',
};

const formatGroupLabel = (data) => (
  <div style={groupStyles}>
    <span>{data.label}</span>
    <span style={groupBadgeStyles}>{data.options.length}</span>
  </div>
);

const TreeHeader = ({
  myMaps,
  othersMaps,
  chooseMap,
  treeInfo,
  toggleDuplicateModal,
  resetLayout,
  refreshTree,
  toggleDelete,
  toggleEditing,
  editing,
  saveMap,
}) => {
  const { t } = useTranslation();

  return (
    <CCardHeader className="dark-header">
      <div className="text-value-lg float-left">{t('entity.entire_tree')}</div>
      <div className="text-right float-right">
        <CButtonToolbar role="group" className="justify-content-end">
          <CLabel className="mr-2 pt-1" htmlFor="deviceType">
            {t('entity.selected_map')}
          </CLabel>
          <div style={{ width: '300px', zIndex: '1028' }} className="text-dark text-left">
            <Select
              name="TreeMaps"
              options={[
                { label: 'Auto-Map', value: '' },
                {
                  label: 'My Maps',
                  options: myMaps.map((m) => ({ value: m.id, label: m.name })),
                },
                {
                  label: 'Maps Created By Others',
                  options: othersMaps.map((m) => ({ value: m.id, label: m.name })),
                },
              ]}
              onChange={(c) => chooseMap(c.value)}
              value={{ value: treeInfo.id, label: treeInfo.name }}
              formatGroupLabel={formatGroupLabel}
            />
          </div>
          <CPopover content={t('common.duplicate')}>
            <CButton
              color="info"
              className="ml-2"
              onClick={toggleDuplicateModal}
              disabled={editing}
            >
              <CIcon content={cilPlus} />
            </CButton>
          </CPopover>
          <CPopover content={t('common.save')}>
            <CButton
              color="info"
              className="ml-2"
              onClick={saveMap}
              disabled={treeInfo.id === '' || !editing}
            >
              <CIcon content={cilSave} />
            </CButton>
          </CPopover>
          <CPopover content="Automatically Align Map">
            <CButton color="info" className="ml-2" onClick={resetLayout}>
              <CIcon content={cilAlignCenter} />
            </CButton>
          </CPopover>
          <CPopover content={t('common.edit')}>
            <CButton
              color="light"
              className="ml-2"
              onClick={toggleEditing}
              disabled={treeInfo.id === '' || editing}
            >
              <CIcon content={cilPencil} />
            </CButton>
          </CPopover>
          <CPopover content={t('common.stop_editing')}>
            <CButton
              color="light"
              className="ml-2"
              onClick={toggleEditing}
              disabled={treeInfo.id === '' || !editing}
            >
              <CIcon content={cilX} />
            </CButton>
          </CPopover>
          <CPopover content={t('common.refresh')}>
            <CButton color="info" className="ml-2" onClick={refreshTree}>
              <CIcon content={cilSync} />
            </CButton>
          </CPopover>
          <CPopover content={t('common.delete')}>
            <CButton
              color="danger"
              className="ml-2"
              onClick={toggleDelete}
              disabled={treeInfo.id === ''}
            >
              <CIcon content={cilTrash} />
            </CButton>
          </CPopover>
        </CButtonToolbar>
      </div>
    </CCardHeader>
  );
};

TreeHeader.propTypes = {
  myMaps: PropTypes.instanceOf(Array).isRequired,
  othersMaps: PropTypes.instanceOf(Array).isRequired,
  chooseMap: PropTypes.func.isRequired,
  treeInfo: PropTypes.instanceOf(Object).isRequired,
  toggleDuplicateModal: PropTypes.func.isRequired,
  resetLayout: PropTypes.func.isRequired,
  refreshTree: PropTypes.func.isRequired,
  toggleDelete: PropTypes.func.isRequired,
  toggleEditing: PropTypes.func.isRequired,
  editing: PropTypes.bool.isRequired,
  saveMap: PropTypes.func.isRequired,
};
export default TreeHeader;
