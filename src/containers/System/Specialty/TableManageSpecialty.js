import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { LANGUAGES } from "../../../utils";
import { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { fetchAllSpecialty } from "../../../store/actions";
import { deleteSpecialtyService } from "../../../services/userService";
import { toast } from "react-toastify";
import "./TableManageSpecialty.scss";

const TableManageSpecialty = (props) => {
  const dispatch = useDispatch();
  const [arrSpecialties, setSpecialties] = useState([]);
  const specialtyRedux = useSelector((state) => state.admin.allSpecialties);

  useEffect(() => {
    dispatch(fetchAllSpecialty());
  }, []);

  useEffect(() => {
    setSpecialties(specialtyRedux);
  }, [specialtyRedux]);

  const handleEditSpecialty = (specialty) => {
    props.handleEditSpecialtyFromParentKey(specialty);
  };

  const handleDeleteSpecialty = async (specialty) => {
    // console.log(specialty);
    let res = await deleteSpecialtyService(specialty.id);
    if (res && res.errCode === 0) {
      toast.success(res.message);
      dispatch(fetchAllSpecialty());
    } else {
      toast.error(res.message);
    }
  };

  return (
    <div className="mt-3 mb-5 table-specialty">
      <table className="table table-hover table-bordered">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th>
              <FormattedMessage id="manage-specialty.name" />
            </th>
            <th>
              <FormattedMessage id="manage-specialty.actions" />
            </th>
          </tr>
        </thead>
        <tbody>
          {arrSpecialties && arrSpecialties.length > 0 ? (
            arrSpecialties.map((item, index) => {
              return (
                <tr key={`specialty-${index}`}>
                  <th scope="row">{item.id}</th>
                  <td>{item.name}</td>
                  <td>
                    <button
                      className="btn-edit"
                      onClick={() => handleEditSpecialty(item)}
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button
                      type="submit"
                      className="btn-delete"
                      onClick={() => handleDeleteSpecialty(item)}
                      disabled
                    >
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </td>
                </tr>
              );
            })
          ) : (
            <>
              <tr>
                <td colSpan={3} className="text-center">
                  <FormattedMessage id="manage-specialty.not-found" />
                </td>
              </tr>
            </>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TableManageSpecialty;
