
#include "UserService.hpp"

std::string UserService::whereQueryString(oatpp::Object<UserDto> dto)
{
  std::string whereQueryString = "";

  // OATPP_LOGd(TAG, "whereQueryString, id = %d, userId = %d, breed = %s, cickId = %d, trueClass = %d, observedClass = %d, predictedClass = %d, score = %d, device = %s, rating = %d", *dto->id, *dto->userId, dto->breed->c_str(), *dto->chickId, *dto->trueClass, *dto->observedClass, *dto->predictedClass, *dto->score, dto->device->c_str(), *dto->rating);
  auto enumEntry = oatpp::Enum<Category>::getEntryByValue(dto->category);
  OATPP_LOGd(TAG, "whereQueryString, address1= {}, category={}, ", dto->address1->c_str(), enumEntry.name.toString());

  /*
  {
    if (*dto->id != 0)
      whereQueryString = "id=:user.id ";

    if (*dto->userName != "*")
    {
      if (whereQueryString != "")
        whereQueryString += " AND ";
      whereQueryString += "userId=:user.userId";
    }

    if (*dto->poiName != "*")
    {
      if (whereQueryString != "")
        whereQueryString += " AND ";
      whereQueryString += "poi_name=:user.poi_name";
    }

    if (*dto->address1 != "*")
    {
      if (whereQueryString != "")
        whereQueryString += " AND ";
      whereQueryString += "chickId=:user.chickId";
    }
    //
    if (*dto->trueClass != 99)
    {
      if (whereQueryString != "")
      {
        whereQueryString = whereQueryString + " AND ";
        whereQueryString = whereQueryString + "trueClass=:user.trueClass";
      }
      else
        whereQueryString = "trueClass=:user.trueClass";
    }

    if (*dto->observedClass != 99)
    {
      if (whereQueryString != "")
      {
        whereQueryString = whereQueryString + " AND ";
        whereQueryString = whereQueryString + "observedClass=:user.observedClass";
      }
      else
        whereQueryString = "observedClass=:user.observedClass";
    }

    if (*dto->predictedClass != 99)
    {
      if (whereQueryString != "")
      {
        whereQueryString = whereQueryString + " AND ";
        whereQueryString = whereQueryString + "predictedClass=:user.predictedClass";
      }
      else
        whereQueryString = "predictedClass=:user.predictedClass";
    }

    if (*dto->score != 0)
    {
      if (whereQueryString != "")
      {
        whereQueryString = whereQueryString + " AND ";
        whereQueryString = whereQueryString + "score >= :user.score";
      }
      else
        whereQueryString = "score > :user.score";
    }

    if (*dto->device != "")
    {
      if (whereQueryString != "")
      {
        whereQueryString = whereQueryString + " AND ";
        whereQueryString = whereQueryString + "device=:user.device";
      }
      else
        whereQueryString = "device=:user.device";
    }

    std::string ratingQueryStr = "";
    switch (*dto->rating)
    {
    case 0:
      break;
    case 1:
    case 2:
    case 3:
    case 4:
    case 5:
    case 11:
    case 12:
      ratingQueryStr = "rating=:user.rating";
      break;
    case 6:
      ratingQueryStr = "rating BETWEEN 2 AND 5";
      break;
    case 7:
      ratingQueryStr = "rating BETWEEN 3 AND 5";
      break;
    case 8:
      ratingQueryStr = "rating BETWEEN 4 AND 5";
      break;
    default:
      throw std::runtime_error("invalid rating");
    }
    OATPP_LOGd(TAG, "ratingQueryStr: %s", ratingQueryStr.c_str());

    if (ratingQueryStr != "")
    {
      if (whereQueryString != "")
      {
        whereQueryString = whereQueryString + " AND ";
        whereQueryString = whereQueryString + ratingQueryStr;
      }
      else
        whereQueryString = ratingQueryStr;
    }
  }
  */

  // whereQueryString = "category=\"CAT_HOTEL\""; // tentative code

  if (*dto->id != 0)
  {
    if (whereQueryString != "")
      whereQueryString += " AND ";
    whereQueryString += "id=:user.id";
  }
  
  if (dto->poiName != "*")
  {
    if (whereQueryString != "")
      whereQueryString += " AND ";
    whereQueryString += "poi_name=:user.poi_name";
  }

  if (dto->address1 != "*")
  {
    if (whereQueryString != "")
      whereQueryString += " AND ";
    whereQueryString += "address1=:user.address1";
  }

  if (dto->address2 != "*")
  {
    if (whereQueryString != "")
      whereQueryString += " AND ";
    whereQueryString += "address2=:user.address2";
  }

  if (dto->address3 != "*")
  {
    if (whereQueryString != "")
      whereQueryString += " AND ";
    whereQueryString += "address3=:user.address3";
  }

  if (enumEntry.name.toString() != "CAT_UNDEFINED")
  // if (enumEntry.index != 99) //not working
  {
    if (whereQueryString != "")
      whereQueryString += " AND ";
    whereQueryString += "category=:user.category";
  }

  if (*dto->iconId != (int)0)
  {
    if (whereQueryString != "")
      whereQueryString += " AND ";
    whereQueryString += "icon_id=:user.icon_id";
  }

  if (whereQueryString != "")
    whereQueryString = "WHERE " + whereQueryString;
  OATPP_LOGd(TAG, "whereQueryString: {}", whereQueryString.c_str());

  return whereQueryString;
}

oatpp::Object<UserDto> UserService::createUser(const oatpp::Object<UserDto> &dto)
{

  auto dbResult = m_database->createUser(dto);
  OATPP_ASSERT_HTTP(dbResult->isSuccess(), Status::CODE_500, dbResult->getErrorMessage());

  auto userId = oatpp::sqlite::Utils::getLastInsertRowId(dbResult->getConnection());

  return getUserById((v_int32)userId);
}

oatpp::Object<UserDto> UserService::updateUser(const oatpp::Object<UserDto> &dto)
{

  auto dbResult = m_database->updateUser(dto);
  OATPP_ASSERT_HTTP(dbResult->isSuccess(), Status::CODE_500, dbResult->getErrorMessage());
  return getUserById(dto->id);
}

oatpp::Object<UserDto> UserService::getUserById(const oatpp::Int32 &id, const oatpp::provider::ResourceHandle<oatpp::orm::Connection> &connection)
{

  auto dbResult = m_database->getUserById(id, connection);
  OATPP_ASSERT_HTTP(dbResult->isSuccess(), Status::CODE_500, dbResult->getErrorMessage());
  OATPP_ASSERT_HTTP(dbResult->hasMoreToFetch(), Status::CODE_404, "User not found");

  auto result = dbResult->fetch<oatpp::Vector<oatpp::Object<UserDto>>>();
  OATPP_ASSERT_HTTP(result->size() == 1, Status::CODE_500, "Unknown error");

  return result[0];
}

oatpp::Object<PageDto<oatpp::Object<UserDto>>> UserService::getAllUsers(const oatpp::UInt32 &offset, const oatpp::UInt32 &limit)
{

  oatpp::UInt32 countToFetch = limit;

  if (limit > 10)
  {
    countToFetch = 10;
  }

  auto dbResult = m_database->getAllUsers(offset, countToFetch);
  OATPP_ASSERT_HTTP(dbResult->isSuccess(), Status::CODE_500, dbResult->getErrorMessage());

  auto items = dbResult->fetch<oatpp::Vector<oatpp::Object<UserDto>>>();

  auto page = PageDto<oatpp::Object<UserDto>>::createShared();
  page->offset = offset;
  page->limit = countToFetch;
  page->count = items->size();
  page->items = items;

  return page;
}

oatpp::Object<StatusDto> UserService::deleteUserById(const oatpp::Int32 &userId)
{
  auto dbResult = m_database->deleteUserById(userId);
  OATPP_ASSERT_HTTP(dbResult->isSuccess(), Status::CODE_500, dbResult->getErrorMessage());
  auto status = StatusDto::createShared();
  status->status = "OK";
  status->code = 200;
  status->message = "User was successfully deleted";
  return status;
}

oatpp::Object<PageDto<oatpp::Object<UserDto>>> UserService::countUsers(const oatpp::Object<UserDto> &dto)
{
  std::shared_ptr<oatpp::orm::QueryResult> dbResult;
  if (!dto)
    dbResult = m_database->executeQuery("SELECT id FROM AppUser;", {});
  else
  {
    std::string queryStr = "SELECT id FROM AppUser ";
    queryStr += whereQueryString(dto);
    queryStr += ";";
    OATPP_LOGd(TAG, "countUsers queryStr: {}", queryStr.c_str());
    dbResult = m_database->executeQuery(queryStr, {{"user", oatpp::Object<UserDto>(dto)}});

    // dbResult = m_database->executeQuery("SELECT id FROM AppUser;", {}); //tentative
  }
  auto items = dbResult->fetch<oatpp::Vector<oatpp::Object<UserDto>>>();

  auto page = PageDto<oatpp::Object<UserDto>>::createShared();
  page->offset = nullptr;
  page->limit = nullptr;
  page->count = items->size();
  page->items = nullptr;

  return page;
}

oatpp::Object<PageDto<oatpp::Object<UserDto>>> UserService::selectUsers(const oatpp::UInt32 &offset, const oatpp::UInt32 &limit, const oatpp::Object<UserDto> &dto)
{
  oatpp::UInt32 countToFetch = limit;

  if (limit > 10)
  {
    countToFetch = 10;
  }

  std::string queryStr = "SELECT * FROM AppUser ";
  auto whereQueryStr = whereQueryString(dto);
  if (whereQueryStr == "")
    throw std::runtime_error("no filter conditions defined");
  queryStr += whereQueryStr;
  queryStr += " LIMIT :limit OFFSET :offset;";
  OATPP_LOGd(TAG, "queryStr: {}", queryStr.c_str());
  auto dbResult = m_database->executeQuery(queryStr, {{"offset", oatpp::UInt32(offset)},
                                                      {"limit", oatpp::UInt32(limit)},
                                                      {"user", oatpp::Object<UserDto>(dto)}});

  // auto dbResult = m_database->getAllUsers(offset, countToFetch); // tentative
  OATPP_ASSERT_HTTP(dbResult->isSuccess(), Status::CODE_500, dbResult->getErrorMessage());

  auto items = dbResult->fetch<oatpp::Vector<oatpp::Object<UserDto>>>();

  auto page = PageDto<oatpp::Object<UserDto>>::createShared();
  page->offset = offset;
  page->limit = countToFetch;
  page->count = items->size();
  page->items = items;

  return page;
}