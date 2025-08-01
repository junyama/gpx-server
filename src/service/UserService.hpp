
#ifndef CRUD_USERSERVICE_HPP
#define CRUD_USERSERVICE_HPP

#include "db/UserDb.hpp"
#include "dto/PageDto.hpp"
#include "dto/StatusDto.hpp"

#include "oatpp/web/protocol/http/Http.hpp"
#include "oatpp/macro/component.hpp"

class UserService
{
private:
  typedef oatpp::web::protocol::http::Status Status;

private:
  constexpr static const char *TAG = "UserService";
  OATPP_COMPONENT(std::shared_ptr<UserDb>, m_database); // Inject database component
  std::string whereQueryString(oatpp::Object<UserDto> dto);

public:
  oatpp::Object<UserDto> createUser(const oatpp::Object<UserDto> &dto);
  oatpp::Object<UserDto> updateUser(const oatpp::Object<UserDto> &dto);
  oatpp::Object<UserDto> getUserById(const oatpp::Int32 &id, const oatpp::provider::ResourceHandle<oatpp::orm::Connection> &connection = nullptr);
  oatpp::Object<PageDto<oatpp::Object<UserDto>>> getAllUsers(const oatpp::UInt32 &offset, const oatpp::UInt32 &limit);
  oatpp::Object<StatusDto> deleteUserById(const oatpp::Int32 &id);

  oatpp::Object<PageDto<oatpp::Object<UserDto>>> countUsers(const oatpp::Object<UserDto> &dto);
  oatpp::Object<PageDto<oatpp::Object<UserDto>>> selectUsers(const oatpp::UInt32 &offset, const oatpp::UInt32 &limit, const oatpp::Object<UserDto> &dto);
};

#endif // CRUD_USERSERVICE_HPP
