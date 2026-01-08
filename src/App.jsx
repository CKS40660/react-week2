import axios from "axios";
import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

const API_BASE = "https://ec-course-api.hexschool.io/v2";
const API_PATH = "cks40660";

function App() {
  // 解構 useState 回傳的結果：formData 是目前的資料狀態，setFormData 是更新formData的方法(function)，useState 內的值是預設資料狀態
  // 要記得post 內的參數要和後端 API 規定的欄位名稱相同
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [isAuth, setisAuth] = useState(false);
  const [products, setProducts] = useState([]);
  // 第二層資料modal
  const [tempProduct, setTempProduct] = useState(null);
  const handleOpenModal = (product) => {
    setTempProduct(product);
  };

  const getData = async () => {
    try {
      const response = await axios.get(
        `${API_BASE}/api/${API_PATH}/admin/products`
      );
      console.log("產品資料：", response.data);
      setProducts(response.data.products);
    } catch (err) {
      console.error("取得產品失敗：", err.response?.data?.message);
    }
  };

  function Card({ product, onOpenModal }) {
    const { title, imageUrl, description, origin_price, price } = product;
    return (
      <div className="col">
        <div className="card" style={{ height: "100%" }}>
          <img src={imageUrl} className="card-img-top" alt={title} />
          <div className="card-body">
            <h5 className="card-title">{title}</h5>
            <p className="card-text">{description}</p>
            <div className="d-flex ">
              <p className="me-auto">
                價格：
                <del>
                  <small>{origin_price}</small>
                </del>{" "}
                {price} 元
              </p>
              <button
                className="btn btn-primary"
                data-bs-toggle="modal"
                data-bs-target="#productModal"
                onClick={() => onOpenModal(product)}
              >
                詳細資訊
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // function Modal({ product }) {
  //   const { title, category, description, imagesUrl, is_enabled, unit, price } =
  //     tempProduct;
  //   return (
  //     <>
  //       <div
  //         className="modal fade "
  //         id="productModal"
  //         tabIndex="-1"
  //         aria-hidden="true"
  //       >
  //         <div className="modal-dialog modal-dialog-centered">
  //           <div className="modal-content">
  //             <div className="modal-header">
  //               <h5 className="modal-title">{title}</h5>
  //               <span className="btn btn-primary btn-sm ms-3">{category}</span>
  //               <button
  //                 type="button"
  //                 className="btn-close"
  //                 data-bs-dismiss="modal"
  //                 aria-label="Close"
  //               ></button>
  //             </div>
  //             <div className="modal-body text-start">
  //               <p>{description} </p>
  //               {imagesUrl.map((img, index) => {
  //                 return <img src={img} alt={title} key={index} />;
  //               })}
  //               <p className="mt-2 mb-0">
  //                 {is_enabled ? `庫存 1 ${unit}` : "已售完"}
  //               </p>
  //               <p>
  //                 售價：
  //                 <span className="fw-bold fs-3">{price}</span>
  //               </p>
  //             </div>
  //             <div className="modal-footer">
  //               <button
  //                 type="button"
  //                 className="btn btn-secondary"
  //                 data-bs-dismiss="modal"
  //               >
  //                 關閉
  //               </button>
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //     </>
  //   );
  // }

  // 輸入表單驗證登入
  async function formSubmit(event) {
    // 阻止預設行為，防止跳轉頁面
    event.preventDefault();
    try {
      // axios.post(url, data, config) 第二個data是傳送的資料，即帳號密碼
      const response = await axios.post(`${API_BASE}/admin/signin`, formData);
      const { token, expired } = response.data;
      // 將 token 寫入 cookie
      document.cookie = `hexToken=${token};expires=${new Date(expired)};`;
      axios.defaults.headers.common.Authorization = `${token}`;
      setisAuth(true);
      // 拿到產品資料
      getData();
      // alert("登入成功");
    } catch (err) {
      alert("請重新登入");
    }
  }
  // 是否為登入狀態
  async function checkLogin() {
    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("hexToken="))
        ?.split("=")[1];
      console.log(token);
      axios.defaults.headers.common.Authorization = token;

      const res = await axios.post(`${API_BASE}/api/user/check`);
      console.log(res);
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <>
      {isAuth ? (
        <div className="container-fluid">
          <h1>商品賣場</h1>
          <div className="row row-cols-2 g-4">
            {products.map((product) => (
              // Card傳product資料
              <Card
                product={product}
                onOpenModal={handleOpenModal}
                key={product.id}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="container">
          {/* 三元只能回傳一個值，不能多排並列，註解也不能放在外面*/}
          <h1>登入</h1>
          <form className="text-start" onSubmit={formSubmit}>
            <div className="form-group">
              <label htmlFor="exampleInputEmail1">帳號</label>
              <input
                type="email"
                className="form-control"
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
                placeholder="E-mail"
                value={formData.username}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    username: e.target.value,
                  })
                }
              />
            </div>
            <div className="form-group">
              <label htmlFor="exampleInputPassword1">密碼</label>
              <input
                type="password"
                className="form-control"
                id="exampleInputPassword1"
                placeholder="Password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    password: e.target.value,
                  })
                }
              />
            </div>
            <div className="d-flex">
              <button type="submit" className="btn btn-primary ms-auto">
                {/* ms-auto要在d-flex下才有用 */}
                送出
              </button>
            </div>
          </form>
        </div>
      )}

      {tempProduct === null ? null : (
        <div
          className="modal fade "
          id="productModal"
          tabIndex="-1"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{tempProduct.title}</h5>
                <span className="btn btn-primary btn-sm ms-3">
                  {tempProduct.category}
                </span>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body text-start">
                <p>{tempProduct.description} </p>
                {tempProduct.imagesUrl.map((img, index) => {
                  return <img src={img} alt={tempProduct.title} key={index} />;
                })}
                <p className="mt-2 mb-0">
                  {tempProduct.is_enabled
                    ? `庫存 1 ${tempProduct.unit}`
                    : "已售完"}
                </p>
                <p>
                  售價：
                  <span className="fw-bold fs-3">{tempProduct.price}</span>
                </p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  關閉
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
