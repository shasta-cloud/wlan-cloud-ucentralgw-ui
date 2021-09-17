import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { CCard, CCardBody } from '@coreui/react';
import axiosInstance from 'utils/axiosInstance';
import { testRegex } from 'utils/helper';
import { useUser, EditMyProfile, useAuth, useToast } from 'ucentral-libs';

const initialState = {
  Id: {
    value: '',
    error: false,
    editable: false,
  },
  currentPassword: {
    value: '',
    error: false,
    editable: true,
  },
  email: {
    value: '',
    error: false,
    editable: false,
  },
  description: {
    value: '',
    error: false,
    editable: true,
  },
  name: {
    value: '',
    error: false,
    editable: true,
  },
  userRole: {
    value: '',
    error: false,
    editable: true,
  },
  notes: {
    value: [],
    editable: false,
  },
};

const ProfilePage = () => {
  const { t } = useTranslation();
  const { currentToken, endpoints, user, getAvatar, avatar } = useAuth();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [initialUser, setInitialUser] = useState({});
  const [userForm, updateWithId, updateWithKey, setUser] = useUser(initialState);
  const [newAvatar, setNewAvatar] = useState('');
  const [newAvatarFile, setNewAvatarFile] = useState(null);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [policies, setPolicies] = useState({
    passwordPolicy: '',
    passwordPattern: '',
    accessPolicy: '',
  });

  const getPasswordPolicy = () => {
    axiosInstance
      .post(`${endpoints.owsec}/api/v1/oauth2?requirements=true`, {})
      .then((response) => {
        const newPolicies = response.data;
        newPolicies.accessPolicy = `${endpoints.owsec}${newPolicies.accessPolicy}`;
        newPolicies.passwordPolicy = `${endpoints.owsec}${newPolicies.passwordPolicy}`;
        setPolicies(response.data);
      })
      .catch(() => {});
  };

  const getUser = () => {
    const options = {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${currentToken}`,
      },
    };

    axiosInstance
      .get(`${endpoints.owsec}/api/v1/user/${user.Id}`, options)
      .then((response) => {
        const newUser = {};

        for (const key of Object.keys(response.data)) {
          if (key in initialState && key !== 'currentPassword') {
            newUser[key] = {
              ...initialState[key],
              value: response.data[key],
            };
          }
        }
        setInitialUser({ ...initialState, ...newUser });
        setUser({ ...initialState, ...newUser });
      })
      .catch(() => {});
  };

  const uploadAvatar = () => {
    const options = {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${currentToken}`,
      },
    };

    const data = new FormData();
    data.append('file', newAvatarFile);

    axiosInstance
      .post(`${endpoints.owsec}/api/v1/avatar/${user.Id}`, data, options)
      .then(() => {
        addToast({
          title: t('user.update_success_title'),
          body: t('user.update_success'),
          color: 'success',
          autohide: true,
        });
        getAvatar();
        setNewAvatar('');
        setNewAvatarFile(null);
        setFileInputKey(fileInputKey + 1);
      })
      .catch(() => {
        addToast({
          title: t('user.update_failure_title'),
          body: t('user.update_failure'),
          color: 'danger',
          autohide: true,
        });
      });
  };

  const updateUser = () => {
    setLoading(true);

    const parameters = {
      id: user.Id,
    };

    let newData = true;

    for (const key of Object.keys(userForm)) {
      if (userForm[key].editable && userForm[key].value !== initialUser[key].value) {
        if (
          key === 'currentPassword' &&
          !testRegex(userForm[key].value, policies.passwordPattern)
        ) {
          updateWithKey('currentPassword', {
            error: true,
          });
          newData = false;
          break;
        } else {
          parameters[key] = userForm[key].value;
        }
      }
    }

    if (newAvatarFile !== null) {
      uploadAvatar();
    }

    if (newData) {
      const options = {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${currentToken}`,
        },
      };

      axiosInstance
        .put(`${endpoints.owsec}/api/v1/user/${user.Id}`, parameters, options)
        .then(() => {
          addToast({
            title: t('user.update_success_title'),
            body: t('user.update_success'),
            color: 'success',
            autohide: true,
          });
        })
        .catch(() => {
          addToast({
            title: t('user.update_failure_title'),
            body: t('user.update_failure'),
            color: 'danger',
            autohide: true,
          });
        })
        .finally(() => {
          getUser();
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  };

  const addNote = (currentNote) => {
    setLoading(true);

    const parameters = {
      id: user.Id,
      notes: [{ note: currentNote }],
    };

    const options = {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${currentToken}`,
      },
    };

    axiosInstance
      .put(`${endpoints.owsec}/api/v1/user/${user.Id}`, parameters, options)
      .then(() => {
        getUser();
      })
      .catch(() => {})
      .finally(() => {
        setLoading(false);
      });
  };

  const showPreview = (e) => {
    const imageFile = e.target.files[0];
    setNewAvatar(URL.createObjectURL(imageFile));
    setNewAvatarFile(imageFile);
  };

  const deleteAvatar = () => {
    setLoading(true);
    const options = {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${currentToken}`,
      },
    };
    return axiosInstance
      .delete(`${endpoints.owsec}/api/v1/avatar/${user.Id}`, options)
      .then(() => {
        getAvatar();
      })
      .catch(() => {})
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (user.Id) {
      getAvatar();
      getUser();
    }
    if (policies.passwordPattern.length === 0) {
      getPasswordPolicy();
    }
  }, [user.Id]);

  return (
    <CCard>
      <CCardBody>
        <EditMyProfile
          t={t}
          user={userForm}
          updateUserWithId={updateWithId}
          saveUser={updateUser}
          loading={loading}
          policies={policies}
          addNote={addNote}
          avatar={avatar}
          newAvatar={newAvatar}
          showPreview={showPreview}
          deleteAvatar={deleteAvatar}
          fileInputKey={fileInputKey}
        />
      </CCardBody>
    </CCard>
  );
};

export default ProfilePage;