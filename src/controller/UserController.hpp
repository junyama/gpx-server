
#ifndef UserController_hpp
#define UserController_hpp

#include "service/UserService.hpp"

#include "oatpp/web/server/api/ApiController.hpp"
#include "oatpp/web/mime/ContentMappers.hpp"
#include "oatpp/macro/codegen.hpp"

#include <unistd.h> //for sleep

#include OATPP_CODEGEN_BEGIN(ApiController) //<- Begin Codegen

/**
 * User REST controller.
 */
class UserController : public oatpp::web::server::api::ApiController
{
public:
  UserController(OATPP_COMPONENT(std::shared_ptr<oatpp::web::mime::ContentMappers>, apiContentMappers))
      : oatpp::web::server::api::ApiController(apiContentMappers)
  {
  }

private:
  constexpr static const char *TAG = "UserController";
  UserService m_userService; // Create user service.
public:
  static std::shared_ptr<UserController> createShared(
      OATPP_COMPONENT(std::shared_ptr<oatpp::web::mime::ContentMappers>, apiContentMappers) // Inject ContentMappers
  )
  {
    return std::make_shared<UserController>(apiContentMappers);
  }

  ENDPOINT_INFO(createUser)
  {
    info->summary = "Create new User";

    info->addConsumes<Object<UserDto>>("application/json");

    info->addResponse<Object<UserDto>>(Status::CODE_200, "application/json");
    info->addResponse<Object<StatusDto>>(Status::CODE_404, "application/json");
    info->addResponse<Object<StatusDto>>(Status::CODE_500, "application/json");
  }
  ENDPOINT("POST", "users", createUser,
           BODY_DTO(Object<UserDto>, userDto))
  {
    return createDtoResponse(Status::CODE_200, m_userService.createUser(userDto));
  }

  ENDPOINT_INFO(putUser)
  {
    info->summary = "Update User by userId";

    info->addConsumes<Object<UserDto>>("application/json");

    info->addResponse<Object<UserDto>>(Status::CODE_200, "application/json");
    info->addResponse<Object<StatusDto>>(Status::CODE_404, "application/json");
    info->addResponse<Object<StatusDto>>(Status::CODE_500, "application/json");

    info->pathParams["userId"].description = "User Identifier";
  }
  ENDPOINT("PUT", "users/{userId}", putUser,
           PATH(Int32, userId),
           BODY_DTO(Object<UserDto>, userDto))
  {
    userDto->id = userId;
    return createDtoResponse(Status::CODE_200, m_userService.updateUser(userDto));
  }

  ENDPOINT_INFO(getUserById)
  {
    info->summary = "Get one User by userId";

    info->addResponse<Object<UserDto>>(Status::CODE_200, "application/json");
    info->addResponse<Object<StatusDto>>(Status::CODE_404, "application/json");
    info->addResponse<Object<StatusDto>>(Status::CODE_500, "application/json");

    info->pathParams["userId"].description = "User Identifier";
  }
  ENDPOINT("GET", "users/{userId}", getUserById,
           PATH(Int32, userId))
  {
    return createDtoResponse(Status::CODE_200, m_userService.getUserById(userId));
  }

  ENDPOINT_INFO(getUsers)
  {
    info->summary = "get all stored users";

    info->addResponse<oatpp::Object<UsersPageDto>>(Status::CODE_200, "application/json");
    info->addResponse<Object<StatusDto>>(Status::CODE_500, "application/json");
  }
  ENDPOINT("GET", "users/offset/{offset}/limit/{limit}", getUsers,
           PATH(UInt32, offset),
           PATH(UInt32, limit))
  {
    return createDtoResponse(Status::CODE_200, m_userService.getAllUsers(offset, limit));
  }

  ENDPOINT_INFO(deleteUser)
  {
    info->summary = "Delete User by userId";

    info->addResponse<Object<StatusDto>>(Status::CODE_200, "application/json");
    info->addResponse<Object<StatusDto>>(Status::CODE_500, "application/json");

    info->pathParams["userId"].description = "User Identifier";
  }
  ENDPOINT("DELETE", "users/{userId}", deleteUser,
           PATH(Int32, userId))
  {
    return createDtoResponse(Status::CODE_200, m_userService.deleteUserById(userId));
  }

  ENDPOINT_INFO(getNumberOfRecords)
  {
    info->summary = "get the total number of the records";
    info->addResponse<String>(Status::CODE_200, "text/plain");
    info->addResponse<Object<StatusDto>>(Status::CODE_500, "application/json");
  }
  ENDPOINT("GET", "getNumberOfRecords", getNumberOfRecords)
  {
    return createDtoResponse(Status::CODE_200, m_userService.countUsers());
  }

  ENDPOINT_INFO(exportGpx)
  {
    info->summary = "export gpx file to local storage";
    info->addResponse<String>(Status::CODE_200, "text/plain");
    info->addResponse<Object<StatusDto>>(Status::CODE_500, "application/json");
  }
  ENDPOINT("GET", "exportGpx", exportGpx)
  {
    int offset = 0;
    int limit = 10;
    int itemsLength = 10;
    String data;
    String fileName;
    system("rm -rf PersonalPOI");
    system("mkdir PersonalPOI");

    do
    {
      auto page = m_userService.getAllUsers(offset, limit);
      itemsLength = page->count;
      for (int i = 0; i < page->count; i++)
      {
        data = page->items[i]->gpx;
        fileName = "PersonalPOI/" + page->items[i]->poiFileName;
        data.saveToFile(fileName->c_str());
        OATPP_LOGd(TAG, "gpx was saved to {}", fileName);
      }
      offset += limit;
    } while (itemsLength != limit);
    //system("cd /home/junichi/github/gpx-server/www"); 
    //sleep(1);
    system("zip -r PersonalPOI.zip PersonalPOI/");

    //return createDtoResponse(Status::CODE_200, m_userService.countUsers());
    return createResponse(Status::CODE_200, "OK");
  }
};

#include OATPP_CODEGEN_END(ApiController) //<- End Codegen

#endif /* UserController_hpp */
