
#ifndef CRUD_STATICCONTROLLER_HPP
#define CRUD_STATICCONTROLLER_HPP

#define PROJECT_ROOT "/home/junichi/github/gpx-server/"
#define WWW_PATH "www/"

#include "oatpp/web/server/api/ApiController.hpp"
#include "oatpp/json/ObjectMapper.hpp"
#include "oatpp/macro/codegen.hpp"
#include "oatpp/macro/component.hpp"
#include "oatpp/web/protocol/http/outgoing/StreamingBody.hpp"

#include OATPP_CODEGEN_BEGIN(ApiController) //<- Begin Codegen

class StaticController : public oatpp::web::server::api::ApiController
{
private:
  constexpr static const char *TAG = "StaticController";
  std::string projectRoot = PROJECT_ROOT;
  std::string filePath;

public:
  StaticController(const std::shared_ptr<oatpp::web::mime::ContentMappers> &apiContentMappers)
      : oatpp::web::server::api::ApiController(apiContentMappers)
  {
  }

public:
  static std::shared_ptr<StaticController> createShared(
      OATPP_COMPONENT(std::shared_ptr<oatpp::web::mime::ContentMappers>, apiContentMappers) // Inject ContentMappers
  )
  {
    return std::make_shared<StaticController>(apiContentMappers);
  }

  ENDPOINT("GET", "/", root)
  {
    filePath = projectRoot + WWW_PATH + "index.html";
    auto fileStream = std::make_shared<oatpp::data::stream::FileInputStream>(filePath.c_str());
    auto body = std::make_shared<oatpp::web::protocol::http::outgoing::StreamingBody>(fileStream);
    auto response = OutgoingResponse::createShared(Status::CODE_200, body);
    response->putHeader(Header::CONTENT_TYPE, "text/html");
    return response;
  }

  ENDPOINT("GET", "/favicon.ico", favicon)
  {
    filePath = projectRoot + WWW_PATH + "favicon.ico";
    auto fileStream = std::make_shared<oatpp::data::stream::FileInputStream>(filePath.c_str());
    auto body = std::make_shared<oatpp::web::protocol::http::outgoing::StreamingBody>(fileStream);
    auto response = OutgoingResponse::createShared(Status::CODE_200, body);
    response->putHeader(Header::CONTENT_TYPE, "image/x-icon");
    return response;
  }

  ENDPOINT("GET", "/functions.js", functionsJs)
  {
    filePath = projectRoot + WWW_PATH + "functions.js";
    auto fileStream = std::make_shared<oatpp::data::stream::FileInputStream>(filePath.c_str());
    auto body = std::make_shared<oatpp::web::protocol::http::outgoing::StreamingBody>(fileStream);
    auto response = OutgoingResponse::createShared(Status::CODE_200, body);
    response->putHeader(Header::CONTENT_TYPE, "text/javascript");
    return response;
  }

  ENDPOINT("GET", "/table.js", tableJs)
  {
    filePath = projectRoot + WWW_PATH + "table.js";
    auto fileStream = std::make_shared<oatpp::data::stream::FileInputStream>(filePath.c_str());
    auto body = std::make_shared<oatpp::web::protocol::http::outgoing::StreamingBody>(fileStream);
    auto response = OutgoingResponse::createShared(Status::CODE_200, body);
    response->putHeader(Header::CONTENT_TYPE, "text/javascript");
    return response;
  }
};

#include OATPP_CODEGEN_END(ApiController) //<- End Codegen

#endif // CRUD_STATICCONTROLLER_HPP
