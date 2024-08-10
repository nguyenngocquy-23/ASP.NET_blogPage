using Microsoft.AspNetCore.Mvc;
using Google.Apis.Auth.OAuth2; // added
using Google.Cloud.Storage.V1; // added
using Microsoft.AspNetCore.Builder.Extensions;
using Microsoft.AspNetCore.Mvc;
using System;
using FirebaseAdmin;
using FirebaseAdmin.Auth;

namespace apiServer.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class UploadController : ControllerBase
    {
        private readonly StorageClient _storageClient;
        private readonly string _bucketName;

        public UploadController()
        {
            //dotnet add package FirebaseAdmin
            FirebaseApp.Create(new AppOptions()
            {
                // chứa thông tin về project firebase và xác thực với project này
                Credential = GoogleCredential.FromFile("../path/firebase/webblog-6eee4-firebase-adminsdk-3ja5x-89dda28363.json")
            });

            _storageClient = StorageClient.Create();
            _bucketName = "gs://webblog-6eee4.appspot.com";
        }

        //Cho phép client tải lên tệp mà không cần phải xử lý quyền truy cập trực tiếp
        [HttpGet("generatePresignedUrl")]
        public IActionResult GeneratePresignedUrl()
        {
            var objectName = Guid.NewGuid().ToString();
            var urlSigner = UrlSigner.FromServiceAccountPath("path/to/your/google-services.json");
            var expiration = TimeSpan.FromMinutes(10); // URL sẽ hết hạn sau 10 phút
            var url = urlSigner.Sign(_bucketName, objectName, expiration, HttpMethod.Put);

            return Ok(new { Url = url, ObjectName = objectName });
        }

        [HttpPost("saveImageUrl")]
        public IActionResult SaveImageUrl([FromBody] ImageInfo imageInfo)
        {
            // Lưu URL vào cơ sở dữ liệu
            // VD: _context.Images.Add(new Image { Url = imageInfo.Url, ... });
            // _context.SaveChanges();

            return Ok();
        }
    }

    public class ImageInfo
    {
        public string Url { get; set; }
        public string ObjectName { get; set; }
        // Bất kỳ thông tin nào khác mà bạn muốn lưu
    }

}