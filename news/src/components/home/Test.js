import React, { useState } from 'react';
import styles from '../home/home.module.css';
function Test() {
  // Khai báo state leftStory với một mảng các câu chuyện
  const [leftStory, setLeftStory] = useState([
    { id: 1, title: 'Story 1' },
    { id: 2, title: 'Story 2' },
    { id: 3, title: 'Story 3' }
  ]);

  return (
    <div>
      {/* Sử dụng phương thức map để tạo các phần tử JSX từ mảng leftStory */}
      {leftStory.map((item, index) => (
          <div className={`${styles.horizontalPost} ` + " mb-20"}>
          <div className={styles.horizontalPost__avt + " avt-140"} >
              <a href="/bo-truong-cong-thuong-diem-danh-hang-loat-vu-livestream-ban-hang-hieu-gia-2287137.html" title="Bộ trưởng Công Thương điểm danh hàng loạt vụ livestream bán hàng hiệu giả">
                  <picture>
                      <source srcset="https://static-images.vnncdn.net/vps_images_publish/000001/000003/2024/6/3/bo-truong-cong-thuong-diem-danh-hang-loat-vu-livestream-ban-hang-hieu-gia-603.jpg?width=260&amp;s=ldh12CeDAL9sLsTWtGQmsw" media="(max-width: 1023px)" />
                      <img data-original="Bộ trưởng Công Thương điểm danh hàng loạt vụ livestream bán hàng hiệu giả" src="https://static-images.vnncdn.net/vps_images_publish/000001/000003/2024/6/3/bo-truong-cong-thuong-diem-danh-hang-loat-vu-livestream-ban-hang-hieu-gia-603.jpg?width=260&amp;s=ldh12CeDAL9sLsTWtGQmsw" alt="Bộ trưởng Công Thương điểm danh hàng loạt vụ livestream bán hàng hiệu giả" />
                  </picture>
              </a>
          </div>
          <div className={styles.horizontalPost__main}>
              <h3 data-id="2287137" className={styles['horizontalPost__main-title']}>
                  <a href="/bo-truong-cong-thuong-diem-danh-hang-loat-vu-livestream-ban-hang-hieu-gia-2287137.html" title="Bộ trưởng Công Thương điểm danh hàng loạt vụ livestream bán hàng hiệu giả" data-utm-source="#vnn_source=trangchu&amp;vnn_medium=tieudiem4" data-limit="80">
                      Bộ trưởng Công Thương điểm danh hàng loạt vụ livestream bán hàng hiệu giả
                  </a>
              </h3>
          </div>
      </div>
      ))}
    </div>
  );
}

export default Test;